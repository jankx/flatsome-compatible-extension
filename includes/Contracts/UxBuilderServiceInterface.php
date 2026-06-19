<?php
namespace Jankx\Extensions\FlatsomeCompatible\Contracts;

interface UxBuilderServiceInterface
{
    public function getElementTypes(): array;
    public function getDefaultLayout(): array;
    public function renderShortcodes(array $elements): string;
    public function parseShortcodes(string $text): array;
    public function getAssetUrl(string $path = ''): string;
    public function getAssetPath(string $path = ''): string;
}
