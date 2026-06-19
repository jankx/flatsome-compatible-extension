<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class DividerStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'divider'; }
    public function getCategory(): string { return 'Basic'; }
    public function getIcon(): string { return 'dashicons-minus'; }

    public function getDefaultProps(): array
    {
        return [
            'width' => '100px',
            'color' => '#cbd5e1',
            'thickness' => '3px',
            'class' => '',
        ];
    }
}
