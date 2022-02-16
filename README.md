## A simple blog api
This is a simple blog api written in next js and has following features:

- Laravel is used as backend api service.
- Laravel breeze (with laravel sanctum) is used for authentication scaffolding.
- Users with odd id cannot create posts.
- Users with even id can create posts.
- Only writer of a post can delete or update that post, unless the user is super admin.
