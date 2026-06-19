<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class VideoStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'video'; }
    public function getCategory(): string { return 'Content'; }
    public function getIcon(): string { return 'dashicons-format-video'; }

    public function getDefaultProps(): array
    {
        return [
            'url' => '',
            'aspect' => '16:9',
            'autoplay' => false,
            'class' => '',
        ];
    }
}
