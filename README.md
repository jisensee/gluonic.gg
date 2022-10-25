# gluonic.gg

The place to discover all the community projects for your favourite game!
Exclusively launching with [Influence] and it's amazing community of builders.

[Check it out here!](https://gluonic.gg)

Also make sure to join the [discord server](https://discord.gg/cYVzNAkQsT) to chat about the project!

## Planned features

This project is in the early stages, there are many more features to be added.
Planned features are:

### Project posts

Project authors can publish posts to make announcements, introduce new features etc.
Those posts will be project specific and be shown on the project page.

### Notifications

Users can opt into a notification system to get notified of certain events.
Those could be

- New game being added
- New project added to a specific game
- New project added in general
- Project publishes a new post
- User adds a new project/publishes a new post (kind of a follow mechanism)

Notifications could be in the form of emails or push notifications.

### Project tags

Simple tagging system to categorize projects.
Tags are created by an admin and can be assigned to projects by their authors.  
Users can then filter projects in the list by one or multiple tags to restrict their search to a certain category.

### Donation stats

Using the donation addresses of projects we can analyze incoming transactions to those and match them to the addresses of registered users to find out who donated to which project.
This info can then be used to generate various leaderboards of top donors, top supported projects, etc.  
To protect the privacy of users this should be opt-in, meaning a user must explicitly consent to being displayed in any kind of leaderboard.

### Project author user management

Allow project authors to add more authors to a project that can manage the project as well.
Each author will have a specific role in that project that restricts what they can do.
Exact roles tbd, depending on the feedback of project authors.

### Discord bot integration

Build a discord bot that hooks into the backend and

- acts like a subscriber to one or many of the outlined notification categories and posts that into a channel. For example posting project posts of a project into an announcement channel or just links it.
- assigns special roles depending on Gluonic user accounts. Donators could get a special role (maybe even tiered) but it could also manage an authors role depending on the assigned authors of a project. This would required some kind of address verification to match Discord users to Gluonic users.
