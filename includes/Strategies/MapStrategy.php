<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class MapStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'map'; }
    public function getCategory(): string { return 'Content'; }
    public function getIcon(): string { return 'dashicons-location-alt'; }

    public function getDefaultProps(): array
    {
        return [
            'address' => '',
            'zoom' => 14,
            'height' => '350px',
            'class' => '',
        ];
    }
}
