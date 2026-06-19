<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class ImageStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'image'; }
    public function getCategory(): string { return 'Content'; }
    public function getIcon(): string { return 'dashicons-format-image'; }

    public function getDefaultProps(): array
    {
        return [
            'url' => '',
            'width' => '100%',
            'height' => 'auto',
            'radius' => '4px',
            'class' => '',
        ];
    }
}
