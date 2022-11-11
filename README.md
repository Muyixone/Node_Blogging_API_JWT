# node_blogging_api_jwt

> Blogging API

An API that performs basic CRUD operations, using express-JWT(JasonWebToken) for authentication

## Requirements

    1. The API must be able to register new users and login old users
    2. Old users must be authenticatedusing JWT, before being able to access private routes
    3. Authenticated users should be able to create a new blog article, delete blog posts and update blog posts.
    4. Users' should be able to get all published blogs(logged-in or not)
    5. Users' email must be unique

## Models

---

#### User

| field      | data_type | constraint       |
| ---------- | --------- | ---------------- |
| first_name | string    | required         |
| last_name  | string    | required         |
| email      | string    | required, unique |
| password   | string    | required         |

#### Blog

| field      | data_type | constraint       |
| ---------- | --------- | ---------------- |
| first_name | string    | required         |
| last_name  | string    | required         |
| email      | string    | required, unique |
| password   | string    | required         |

## APIs

---

#### Signup User

&bull; Route: api/users/register
&bull; Method: POST
&bull; Body:

```
{
	"first_name": "Xone",
	"last_name": "Smith",
	"email": "xonesm@yahoo.com",
	"password": "password5678"
}
```

&bull; Response

Success

```
{
	"status": "success"
	user: {
		"first_name": "Xone",
		"last_name": "Smith",
		"email": "xonesm@yahoo.com",
		"password": "password5678"
	}
}
```

---

#### Login User

&bull; Route: api/users/login
&bull; Method: POST
&bull; Body:

```
{
	"email": "xonesm@yahoo.com",
	"password": "password5678"
}
```

&bull; Response

Success

```
{
		"message": "login successful",
		"token": "kkkkldhkljkdshg"
}
```

---

#### Create Blog Post

Route: api/blogs/authenticate
Method: POST
Header
Authorization: Bearer {token}
Body:

```
{
  "title": "Resiliencet",
  "description": "Random musings",
  "state": "Draft",
  "tags": "#muyi",
  "body": "I do not believe Peter Obi gained anything from taking part in whatever that was on Arise TV last night."
}
```

&bull; Response

Success

```
{
    {"_id":{"$oid":"636924f20bdb892171db943a"},
    "title":"Resilience",
    "description":"Random musings",
    "author":{"$oid":"63684a22996988d3d8fc2d20"},
    "state":"Draft",
    "read_count":{"$numberInt":"0"},
    "reading_time":"1 minutes read",
    "tags":"#muyi",
    "body":"I do not believe Peter Obi gained anything from taking part in whatever that was on Arise TV last night",
    "createdAt":{"$date":{"$numberLong":"1667835122527"}},
    "updatedAt":{"$date":{"$numberLong":"1667835122527"}},"__v":{"$numberInt":"0"}}
}
```

---

#### Get All Blog Posts

&bull; Route: api/blogs
&bull; Method: GET
&bull; Query params: - page (default: 1) - per_page (default: 20) - order_by (read_count, read_time, time_stamp) - order (options: asc | desc, default: desc) - state(default: draft) - created_at

&bull; Responses

Sucess

```
{
    {"_id":{"$oid":"636924f20bdb892171db943a"},
    "title":"Resilience",
    "description":"Random musings",
    "author":{"$oid":"63684a22996988d3d8fc2d20"},
    "state":"Draft",
    "read_count":{"$numberInt":"0"},
    "reading_time":"1 minutes read",
    "tags":"#muyi",
    "body":"I do not believe Peter Obi gained anything from taking part in 			whatever that was on Arise TV last night",
    "createdAt":{"$date":{"$numberLong":"1667835122527"}},
    "updatedAt":{"$date":{"$numberLong":"1667835122527"}},"__v":{"$numberInt":"0"}}
}
```

---

#### Get a Blog Post

&bull; Route: api/blogs/:id
&bull; Method: GET
&bull; Query params: - page (default: 1) - order_by (read_count, read_time, time_stamp) - order (options: asc | desc, default: desc) - state(default: draft) - created_at

&bull; Responses

```
{
    {"_id":{"$oid":"636924f20bdb892171db943a"},
    "title":"Resilience",
    "description":"Random musings",
    "author":{"$oid":"63684a22996988d3d8fc2d20"},
    "state":"Draft",
    "read_count":{"$numberInt":"0"},
    "reading_time":"1 minutes read",
    "tags":"#muyi",
    "body":"I do not believe Peter Obi gained anything from taking part in 			whatever that was on Arise TV last night",
    "createdAt":{"$date":{"$numberLong":"1667835122527"}},
    "updatedAt":{"$date":{"$numberLong":"1667835122527"}},"__v":{"$numberInt":"0"}}
}
```

---

#### Delete a blog post

&bull; Route: api/blogs/authenticate/:id
&bull; Method: GET
&bull; Header

- Authorization: Bearer(token)
  &bull; Query params: - page (default: 1)
  - order_by (read_count, read_time, time_stamp)
  - order (options: asc | desc, default: desc)
  - state(default: draft)
  - created_at

&bull;Responses

```
{
    {"_id":{"$oid":"636924f20bdb892171db943a"},
    "title":"Resilience",
    "description":"Random musings",
    "author":{"$oid":"63684a22996988d3d8fc2d20"},
    "state":"Draft",
    "read_count":{"$numberInt":"0"},
    "reading_time":"1 minutes read",
    "tags":"#muyi",
    "body":"I do not believe Peter Obi gained anything from taking part in 			whatever that was on Arise TV last night",
    "createdAt":{"$date":{"$numberLong":"1667835122527"}},
    "updatedAt":{"$date":{"$numberLong":"1667835122527"}},"__v":{"$numberInt":"0"}}
}
```

---

## Install

With [npm](https://npmjs.org/) installed, run

`npm init`

---

## Contributor

&bull; Osamuyi Emwins Alarezomo
