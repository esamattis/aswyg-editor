<?php

class Editor
{

    public function __construct()
    {
        $this->plugin_path = dirname(__FILE__);
        $this->site_root = '/';

        $this->is_preview = false;
        $this->is_json = false;
        $this->is_editor = false;

    }

    public function request_url(&$url)
    {
        if ($url === 'pages.json') {
            return $this->render_pages_list_json();
        }

        if (isset($_GET['show'])) {
            $this->is_preview = $_GET['show'] === "preview";
            $this->is_json = $_GET['show'] === "json";
            $this->is_editor = $_GET['show'] === "editor";
        }
    }

    public function before_load_content(&$file)
    {
        $this->public_file = $file;
        $this->preview_file = $file . ".preview";

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->save_page($_POST);
            exit();
        }

        if ($this->is_preview) {
            if (file_exists($this->preview_file)) {
                $file = $this->preview_file;
            }
            return;
        }

        if ($this->is_json) {
            $this->render_file_json();
        }

    }

    public function before_render(&$twig_vars, &$twig)
    {
        if ($this->is_editor) $this->render_editor();
    }

    private function save_page($data)
    {
        if ($data['type'] === "public") {
            file_put_contents($this->public_file, $data['value']);
        }
        if ($data['type'] === "preview") {
            file_put_contents($this->preview_file, $data['value']);
        }

        $this->render_json(array('message' => 'ok'));

    }

    private function render_file_json()
    {
        $this->render_json(array(
            'public' => @file_get_contents($this->public_file),
            'preview' => @file_get_contents($this->preview_file)
        ));
    }

    private function render_pages_list_json()
    {
        $pages = array();
        $page_pat = '/\.md(\.preview$|$)/';
        $preview_pat = '/\.md\.preview$/';

        if ($handle = opendir(CONTENT_DIR)) {
            while (false !== ($entry = readdir($handle))) {
                $page = array();

                if ($entry === '.' && $entry === '..') continue;
                if ($entry === '404.md') continue;
                if (!preg_match($page_pat, $entry)) continue;

                $url = preg_replace($page_pat, '', $entry);
                $title = $url;

                if (!preg_match($preview_pat, $entry)) {
                    $title .= " (DRAFT)";
                }

                array_push($pages, array(
                    //TODO: open the file and read the title from header
                    'title' => $title,
                    'url' => '/' . $url
                ));
            }
            closedir($handle);
        }

        $this->render_json($pages);
    }

    private function render_json($data)
    {
        header('Content-Type: application/json');
        die(json_encode($data));
    }


    private function render_editor()
    {
        die(file_get_contents($this->plugin_path . '/editor.html'));
    }

    private function assert_auth()
    {
        // TODO
    }



}

?>
