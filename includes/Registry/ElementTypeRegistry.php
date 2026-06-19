<?php
namespace Jankx\Extensions\FlatsomeCompatible\Registry;

use Jankx\Extensions\FlatsomeCompatible\Contracts\ElementTypeStrategy;

class ElementTypeRegistry
{
    private static $strategies = [];

    public static function register(ElementTypeStrategy $strategy): void
    {
        self::$strategies[$strategy->getType()] = $strategy;
    }

    public static function registerMultiple(array $strategies): void
    {
        foreach ($strategies as $strategy) {
            if ($strategy instanceof ElementTypeStrategy) {
                self::register($strategy);
            }
        }
    }

    public static function get(string $type): ?ElementTypeStrategy
    {
        return self::$strategies[$type] ?? null;
    }

    public static function has(string $type): bool
    {
        return isset(self::$strategies[$type]);
    }

    public static function all(): array
    {
        return self::$strategies;
    }

    public static function getByCategory(string $category): array
    {
        return array_filter(self::$strategies, function ($strategy) use ($category) {
            return $strategy->getCategory() === $category;
        });
    }

    public static function clear(): void
    {
        self::$strategies = [];
    }
}
