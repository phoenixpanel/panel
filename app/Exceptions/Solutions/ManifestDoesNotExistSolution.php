<?php

namespace PhoenixPanel\Exceptions\Solutions;

class ManifestDoesNotExistSolution
{
    /**
     * Get the solution title.
     *
     * @return string
     */
    public function getSolutionTitle()
    {
        return "The manifest.json file hasn't been generated yet";
    }

    /**
     * Get the solution description.
     *
     * @return string
     */
    public function getSolutionDescription()
    {
        return 'Run yarn run build:production to build the frontend first.';
    }

    /**
     * Get documentation links.
     *
     * @return array
     */
    public function getDocumentationLinks()
    {
        return [
            'Docs' => 'https://github.com/phoenixpanel/panel/blob/develop/package.json',
        ];
    }
}

