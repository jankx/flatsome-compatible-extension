<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class RowStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'row'; }
    public function getCategory(): string { return 'Layout'; }
    public function getIcon(): string { return 'dashicons-grid-view'; }

    public function getDefaultProps(): array
    {
        return [
            'gutter' => 'medium',
            'width' => 'container',
            'class' => '',
        ];
    }
}
