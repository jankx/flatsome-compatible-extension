<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class TextStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'text'; }
    public function getCategory(): string { return 'Content'; }
    public function getIcon(): string { return 'dashicons-editor-paragraph'; }

    public function getDefaultProps(): array
    {
        return [
            'text' => '<h3>Awesome Title</h3><p>Enter your content here.</p>',
            'class' => '',
        ];
    }
}
