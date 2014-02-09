<?php
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

function starts_with($haystack, $needle)
{
    return !strncmp($haystack, $needle, strlen($needle));
}

class Aswyg_Controller
{
    public function __construct($url, $file)
    {
        $this->public_file = $file;
        $this->draft_file = $file . ".draft";
        $this->site_root = '/';

        if (starts_with($url, $this->site_root)) {
            $this->url = $url;
        } else {
            $this->url = $this->site_root . $url;
        }

        $this->url = preg_replace('/.+(\/$)/', '', $this->url);


        $this->plugin_path = dirname(__FILE__);
        $this->loader = new Twig_Loader_Filesystem($this->plugin_path);
    }

    public function authenticate()
    {
        return true;
    }

    public function render_login_form()
    {
        return "login form";
    }

    public function render_editor()
    {
        return $this->render_template("editor.html", array(
            'initial' => $this->get_page_data()
        ));
    }

    public function save_draft()
    {
        $data = file_get_contents("php://input");
        if ($data === false) return $this->die_error();

        if (file_put_contents($this->draft_file, $data, LOCK_EX) === false) {
             return $this->die_error("Failed to save draft file: " . $this->draft_file);
        }

        return $this->render_json(array('ok' => true));
    }

    public function delete_draft()
    {
        if (@file_exists($this->draft_file) && unlink($this->draft_file) === false) {
             return $this->die_error();
        }
        error_log("Draft deleted: " . $this->draft_file);
    }

    public function publish_page()
    {
        $data = file_get_contents("php://input");
        if ($data === false) return $this->die_error();

        if (file_put_contents($this->public_file, $data, LOCK_EX) === false) {
             return $this->die_error();
        }

        $this->delete_draft();

        return $this->render_json(array('ok' => true));
    }

    public function delete_page()
    {
        error_log("DEÖETE");

        $this->delete_draft();

        if (@file_exists($this->public_file) && unlink($this->public_file) === false) {
             return $this->die_error();
        }
        error_log("Public deleted: " . $this->draft_file);
    }

    private function die_error($msg='')
    {
         header('HTTP/1.1 500 Internal Server Error', true, 500);
         die($msg);
    }

    private function get_page_data()
    {
        $data = array(
            'publicUrl' => $this->url,
            'draftUrl' => $this->url === '/' ? '/_draft' : $this->url . '/_draft',
            'draft' => @file_get_contents($this->draft_file),
            'public' => @file_get_contents($this->public_file)
        );

        if (!$data['draft'] && !$data['public']) {
            // error_log($this->plugin_path + 'initial.md');
            $data['draft'] = file_get_contents($this->plugin_path . '/initial.md');
            if ($data['draft'] === false) {
                $this->die_error("Failed to read initial.md");
            }
        }

        return $data;
    }

    public function render_page_json()
    {
        return $this->render_json($this->get_page_data());
    }

    public function render_page_index_json()
    {
        $pages = array();

        if ($handle = opendir(CONTENT_DIR)) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {

                    preg_match('/^(.+?)\.md(\.draft$|$)/', $entry, $groups);
                    if (!$groups) continue;

                    $slug = $groups[1];
                    $is_draft = !!$groups[2];

                    if (isset($pages[$slug])) {
                        $page = $pages[$slug];
                    } else {
                        $page = array();
                    }

                    // TODO: read title from the file
                    $page['title'] = $groups[1];
                    $page['slug'] = $groups[1];

                    if (!isset($page['hasDraft']) && $is_draft) {
                        $page['hasDraft'] = true;
                    }

                    $pages[$slug] = $page;
                }
            }
            closedir($handle);
        }

        $pages_array = array();
        foreach ($pages as $val) {
            array_push($pages_array, $val);
        }
        return $this->render_json($pages_array);
    }

    private function render_json($data)
    {
        header('Content-Type: application/json');
        return json_encode($data);
    }

    private function render_template($tmpl, $context)
    {
        $twig = new Twig_Environment($this->loader);
        return $twig->render($tmpl, $context);
    }

}

class Aswyg_Editor_Plugin
{

    public function __construct()
    {
        $this->url = '';
        $this->enabled = false;
        $this->is_draft = false;
        $this->is_edit = false;
        $this->is_index = false;
        $this->is_json = false;
        $this->is_json = false;
        $this->method = '';
    }


    public function request_url(&$url)
    {
        $this->method = $_SERVER['REQUEST_METHOD'];

        if ($this->method === 'PUT' || $this->method === 'DELETE') {
            $this->enabled = true;
        }

        // Urls ending with _draft, _edit, _index and _json are handled by
        // Aswyg Editor Plugin
        $url_pat = '/^(.*?)(?:^|\/)(_draft$|_edit$|_index$|_json$|_logout$|$)/';
        preg_match($url_pat, $url, $groups);


        if ($groups) {
            $this->enabled = true;

            $this->is_draft = $groups[2] === '_draft';
            $this->is_edit = $groups[2] === '_edit';
            $this->is_index = $groups[2] === '_index';
            $this->is_json = $groups[2] === '_json';
            $this->is_logout = $groups[2] === '_logout';
            $this->enabled = true;

            // Restore normal url for Pico
            $url = $groups[1];
        }

        $this->url = $url;
    }

    private function route($method, $action)
    {
    
    }

    public function before_load_content(&$file)
    {
        if (!$this->enabled) return;

        $aswyg = new Aswyg_Controller($this->url, $file);
        if (!$aswyg->authenticate()) {
            die($aswyg->render_login_form());
        }

        // If this is a draft request just change the file loaded by Pico to be
        // our draft file and continue normallly.
        if ($this->method === 'GET' && $this->is_draft) {
            if (file_exists($aswyg->draft_file)) {
                $file = $aswyg->draft_file;
            }
            return;
        }

        // Otherwise stop pico machinery and render page using Aswyg_Controller
        if ($this->method === 'PUT' && $this->is_draft) die($aswyg->save_draft());
        if ($this->method === 'GET' && $this->is_edit) die($aswyg->render_editor());
        if ($this->method === 'GET' && $this->is_json) die($aswyg->render_page_json());
        if ($this->method === 'GET' && $this->is_index) die($aswyg->render_page_index_json());
        if ($this->method === 'PUT') die($aswyg->publish_page());
        if ($this->method === 'DELETE') die($aswyg->delete_page());
    }

}

?>
