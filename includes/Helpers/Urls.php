<?php
namespace Jankx\Extensions\FlatsomeCompatible\Helpers;

class Urls
{
    public static function editUrl(int $postId, ?int $editPostId = null, string $type = 'editor'): string
    {
        $editLink = get_edit_post_link($postId, 'raw');

        $editLink = add_query_arg('app', 'uxbuilder', $editLink);
        $editLink = add_query_arg('type', $type, $editLink);

        if ($editPostId) {
            $editLink = add_query_arg('edit_post_id', $editPostId, $editLink);
        }

        return $editLink;
    }

    public static function iframeUrl(int $postId, ?int $editPostId = null): string
    {
        $permalink = get_permalink($postId);
        $permalink = add_query_arg('post_id', $postId, $permalink);
        $permalink = add_query_arg('uxb_iframe', '1', $permalink);

        if ($editPostId) {
            $permalink = add_query_arg('edit_post_id', $editPostId, $permalink);
        }

        if (is_ssl()) {
            $permalink = str_replace('http:', 'https:', $permalink);
        }

        return $permalink;
    }

    public static function editorDataUrl(int $postId, ?int $editPostId = null): string
    {
        $editLink = get_edit_post_link($postId, 'raw');
        return $editLink;
    }
}
