<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class ButtonStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'button'; }
    public function getCategory(): string { return 'Basic'; }
    public function getIcon(): string { return 'dashicons-button'; }

    public function getDefaultProps(): array
    {
        return [
            'text' => 'Explore Works',
            'link' => '#',
            'color' => 'primary',
            'style' => 'filled',
            'size' => 'medium',
            'class' => '',
        ];
    }
}
