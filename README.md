# Scheduling service

The service provides endpoints to manage events such as meetings and manages users that can be host of the meeting or a participant of the meeting.

## It provides following API endpoints:
* Create/Update/Delete an event for a single block of time in a day.
* Create/Update/Delete users that can host or participate in those events.
* Add participants to an event from the pool of available users.
* Query the list of events using the following criteria:
  * By participant or host user
  * By date range.
* Remove participants from an event.
* An event participant may be the host. There can only be a single host for an event.
* A participant can be marked as optional or required.
* A participant can indicate their intention to accept the invitation or decline the invitation.

#
## API
### User management
* POST `/api/users/`
  * Parameters
    ```bash
    * request body
      {
        "firstName": "string",
        "lastName": "string",
        "email": "user@example.com"
      }
    ```
  * Response example
    ```bash
    * code: 201
    * response body
    {
      "data": {
        "_id": "uuid",
        "firstName": "string",
        "lastName": "string",
        "email": "user@example.com",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "__v": 0
      },
     "message": "An user was created successfully"
    }
     ```
* GET `/api/users/`
  * Parameters
    ```bash
    * No Parameters
    ```
  * Response
    ```bash
    * code: 200
    * response body
    {
      "data": [
        {
          "_id": "uuid",
          "firstName": "string",
          "lastName": "string",
          "email": "user@example.com",
          "createdAt": "datetime",
          "updatedAt": "datetime",
          "__v": 0
        }
      ]
    }
     ```
* GET `/api/users/{id}`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    ```
  * Response
    ```bash
    * code: 200
    * response body
    {
      "data": {
        "_id": "uuid",
        "firstName": "string",
        "lastName": "string",
        "email": "user@example.com",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "__v": 0
      }
    }
     ```
* PUT `/api/users/{id}`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    * request body
      {
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    ```
  * Response
    ```bash
    * code: 200
    * response body
    {
      "message": "User was updated successfully."
    }
     ```
* DELETE `/api/users/{id}`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    ```
  * Response
    ```bash
    * code: 200
    * response body
    {
      "message":"User was deleted successfully"
    }
     ```
### Event management
* POST `/api/events/`
  * Parameters
    ```bash
    * request body
      {
        "name": "string",
        "startAt": "datetime",
        "endAt": "datetime",
        "participants": [
          {
            "user": "uuid",
            "isHost": true,
            "isRequired": true,
            "isAccepted": true
          }
        ]
      }
    ```
  * Response example
    ```bash
    * code: 201
    * response body
    {
    "data": {
      "_id": "uuid",
      "name": "string",
      "startAt": "datetime",
      "endAt": "datetime",
      "participants": [
        {
          "isRequired": true,
          "isAccepted": true,
          "_id": "uuid",
          "user": "uuid",
          "isHost": true
        }
      ],
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "__v": 0
    }
  }
     ```
* GET `/api/events/`
  * Parameters
    ```bash
    * query
      from: datetime
      to: datetime
      hostId: uuid(id of participant instance)
      participantId: uuid(id of participant instance)
    * request body
     {
      "detail": true
     }
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
      "data": [
        {
          "_id": "uuid",
          "name": "string",
          "startAt": "datetime",
          "endAt": "datetime",
          "participants": [
            {
              "isRequired": false,
              "isAccepted": false,
              "_id": "uuid",
              "user": {
                "_id": "uuid",
                "firstName": "string",
                "lastName": "string",
                "email": "user@example.com"
              },
              "isHost": false
            }
          ],
          "createdAt": "datetime",
          "updatedAt": "datetime",
          "__v": 0
        }
      ]
    }
     ```
* GET `/api/events/{id}`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    * request body
      {
        "detail": true
      }
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
      "data": {
        "_id": "uuid",
        "name": "string",
        "startAt": "datetime",
        "endAt": "datetime",
        "participants": [
          {
            "isRequired": false,
            "isAccepted": false,
            "_id": "uuid",
            "user": {
              "_id": "uuid",
              "firstName": "string",
              "lastName": "string",
              "email": "user@example.com"
            },
            "isHost": false
          }
        ],
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "__v": 0
      }
    }
     ```
* PUT `/api/events/{id}`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    * request body
      {
        "name": "string"
      }
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
    "message": "Event was updated successfully.",
    "data": {
      "_id": "uuid",
      "name": "string",
      "startAt": "datetime",
      "endAt": "datetime",
      "participants": [
          {
            "isRequired": false,
            "isAccepted": false,
            "_id": "uuid",
            "user": "uuid",
            "isHost": false
          }
      ],
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "__v": 0
    }
  }
     ```
* PUT `/api/events/{id}/add-participants`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    * request body
      [
        {
          "isRequired": false,
          "isAccepted": false,
          "user": "uuid",
          "isHost": false
        }
     ]
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
      "message": "participants were added successfully."
    }
     ```
* PUT `/api/events/{id}/remove-participants`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    * request body
      [
        "uuid"
      ]
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
      "message": "Participants were removed from the event successfully."
    }
     ```
* PUT `/api/events/{id}/update-status`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    * request body
      {
        "user": "uuid",
        "isAccepted": false,
        "isRequired": false,
        "isHost": false
      }
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
      "message": "User status was updated successfully."
    }
     ```
* DELETE `/api/events/{id}`
  * Parameters
    ```bash
    * path
      id: uuid(required)
    ```
  * Response example
    ```bash
    * code: 200
    * response body
    {
      "message": "Event was deleted successfully."
    }
     ```

## Quick Start

### Requirements
Before starting the server, you should start `MongoDB` server on your local environment
### Install dependencies:
```console
$ npm install
```
### Start the server
```console
$ npm run dev
```
Server is running on http://localhost:8080

### Running Tests
```console
$ npm run test
```
