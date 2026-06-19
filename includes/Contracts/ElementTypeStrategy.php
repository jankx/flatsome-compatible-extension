<?php
namespace Jankx\Extensions\FlatsomeCompatible\Contracts;

interface ElementTypeStrategy
{
    public function getType(): string;
    public function getLabel(): string;
    public function getCategory(): string;
    public function getDefaultProps(): array;
    public function getIcon(): string;
    public function render(array $props, array $children = []): string;
    public function getShortcode(array $props): string;
}
