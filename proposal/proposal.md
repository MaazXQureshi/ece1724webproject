# VolunteerConnect

#### An interactive dashboard for volunteers and event organizers

---

###### Elly Wong 1006313954

###### Maaz Qureshi 1006319761

---

## Motivation

Throughout the team’s time living in Toronto, through school and university, it has been difficult to find information on volunteering events happening around the city. To find such events, people have often had to rely on flyers or bulletin boards which are often overpopulated with unrelated advertisements, out-of-date information or are mostly ignored due to the lack of accessibility these options offer. Most people rely on word of mouth or happen to come across posts on social media advertising volunteering events, both of which are unreliable mediums. Additionally, these fare poorly when wanting to search for events that pertain to personal interests since organizers and events are not filtered.

Consequently, being executive members of university clubs, it has been equally difficult to advertise volunteering events, having to rely on social media such as Facebook, Instagram and Discord. These come with limitations of their own, as users have to be following social media accounts or be part of groups in order to be notified of new events - defeating the purpose of having people discover new volunteering opportunities.

Overall, there is a seeming lack of a centralized volunteering hub for people to look up volunteering events that are happening around the city in a convenient manner, as well as event organizers to get an accurate headcount for planning purposes. Our project aims to address this by giving the community a dashboard on which to post, search for, view and sign up for volunteering events that are happening across the city.

This project is worth pursuing for the benefit of the entire Toronto community - both for people exploring for events to volunteer in, as well as event organizers to determine interest. Having a centralised dashboard helps all manner of students. Residents who have just moved into the city might not know where to look or who to ask for regarding volunteering opportunities - this dashboard will help them conveniently search for and view all sorts of events that they are interested in, as well as help express interest in them to notify the organizers and secure a spot. Long-time residents trying to find specific opportunities to suit their specialized interests will benefit greatly from the dashboard’s searching and filtering features, as well as view information to help them determine what fits into their schedule. Other target users include event organizers who, through the use of this platform, are able to post volunteering opportunities in a centralized place for all in the community to look at rather than having to rely on social media posts which may not reach the intended demographic. Furthermore, it helps them streamline event posting rather than having to manually create interest forms which in turn is complemented by the register feature for organizers to get an accurate headcount to better plan out these events.

An existing solution is [Volunteer Toronto](https://www.volunteertoronto.ca/) which appears to be the central volunteering hub for Toronto. While this website has a good list of volunteering opportunities and sees frequent activity, there are a few limitations. The website only allows organizations to register (with a subscription fee) with no support for the general user, thereby neglecting a customized experience. The site’s interface looks dated, with little to no support for images and files when creating events as well very sparse search options limited mostly to keywords, category, and location. The site represents more of an information or listing hub rather than a dashboard that is tailored to be an all-in-one platform for both organizers and volunteers, which is what our platform aims to achieve.

All in all, the dashboard seeks to help the entire Toronto community by making volunteering event creation, browsing and registering much more streamlined by consolidating it all under a single, convenient dashboard.

## Objective and Key Features

The project’s objective is to create a dashboard focused on features such as volunteering events browsing, searching, filtering, creation and subscription to make it easier for volunteers to find the opportunities they seek. It aims to help users quickly discover and manage events by consolidating all of these features in one application through the use of an extensive landing dashboard page, search bar and filtration options. The project also aims to give users a customizable experience by allowing them to shortlist events for viewing later and get notifications about all with the click of a few buttons in order to make the entire process as convenient as possible.

Another objective of the application is to offer event organizers with a simple form creation for publishing their events without having to go through the hassle of creating one themselves, coupled with a registration system for obtaining an accurate headcount. Overall, the project’s purpose is to aid volunteers and event organizers by offering a fully integrated dashboard for all volunteering related information rather than having them pursue other, more inefficient avenues.

### Core Features

- **Browse/Search for volunteering events**

  - The landing page features a dashboard allowing users to explore volunteering opportunities.
  - A search bar with advanced filtering options will be available for users to narrow down their search based on their interests and availability.

- **Event creation**:

  - Organizers can register and publish new events for users to view and subscribe to, including all relevant information such as name, location, date / time, images, etc.

- **Subscription system**
  - Users will be able to save events for viewing later. This will allow users to create a personalized list of interested events and additionally help organizers manage headcount.

### Advanced Features

- **User authentication and authorization**
  - The platform will implement secure login and role-based access control, controlling access between community members and event organizers.
- **API integration with external services**
  - Email notification system to send announcements, updates or reminders to users who have subscribed to a volunteering event
  - Google Maps or equivalent API to show accurate event locations (lower priority, time permitting)

### Technical implementation approach

The project will be implemented using a React frontend and Express.js backend, with PostgreSQL for relational data storage and DigitalOcean Spaces for file storage. The backend will handle the business logic, managing user profiles, event information, and the relationships between the user and event entities. It will provide a RESTful API for data retrievals and updates, facilitating the communication between the frontend and data stores. The frontend will deliver a responsive user interface, with basic state management for form handling and search functionalities. It will communicate with the backend API to enable the core features in the user experience.

### Database schema and relationships

_Database schema diagram created using [dbdiagram.io](https://www.dbdiagram.io)_

![database](https://raw.githubusercontent.com/MaazXQureshi/ece1724webproject/refs/heads/master/proposal/proposal_images/database.png)

### File storage requirements

File storage will be used to store event images, such as promotional posters or organization logos. Each event in the database will have an `image_url` field in the events table that stores the reference URL to the uploaded image. This approach will help efficiently manage image file storage and keep the database lightweight.

### User interface and experience design

A separate frontend experience will be designed for our two user groups, community members and event organizers. Users can register an account on the web application. Upon logging in, users will have access to features specific to their user role. For community members looking for volunteering opportunities, the user interface provides a dashboard to search for events based on different attributes and subscribe to events that they are interested in joining. Event organizers will have a dedicated interface to create, update, and manage their organisational events, ensuring that they can easily share information and track participation.

_All UI designs created using [Figma](https://www.figma.com)_

#### Events dashboard

![events_dashboard](https://raw.githubusercontent.com/MaazXQureshi/ece1724webproject/refs/heads/master/proposal/proposal_images/events_dashboard.png)

#### Organizer information page

![organizer_page](https://raw.githubusercontent.com/MaazXQureshi/ece1724webproject/refs/heads/master/proposal/proposal_images/organizer_page.png)

#### Event creation/edit page

![create_event](https://raw.githubusercontent.com/MaazXQureshi/ece1724webproject/refs/heads/master/proposal/proposal_images/create_event.png)

#### Search bar filter dialog

![filter](https://raw.githubusercontent.com/MaazXQureshi/ece1724webproject/refs/heads/master/proposal/proposal_images/filter.png)

#### Event info dialog

![event_info](https://raw.githubusercontent.com/MaazXQureshi/ece1724webproject/refs/heads/master/proposal/proposal_images/event_info.png)

### Integration with external services

The project will integrate with the following third-party APIs to further enhance user experience:

1. Email API: An email service like SendGrid will be used to send notifications and announcements to users who have subscribed to events. This gives the event organizers a simple way to communicate with interested participants.
2. Google Maps API: This is a optional API integration that the team plans to add if time permits. It will display the location of the event on an interactive map, providing users with better location context.

### Explanation of how these features fulfill the course requirements

The project leverages modern technologies and web development best practices for both frontend and backend development. The responsive user interface will be built using React and Tailwind CSS, leveraging reusable components offered by shadcn/ui such as dashboard cards and forms. It uses Express.js as backend to manage data stored in PostgreSQL and image URLs stored on the cloud using DigitalOcean Spaces. The frontend and backend will interact using RESTful API as implemented in course assignments.

In addition, the project implements two advanced features:

- **User Authentication and Authorization**：Secure login and role-based access control are implemented to manage the two user roles, ensuring that users can only access features relevant to their role.

- **API integration with external services**：The platform will be integrated with an email API to manage event communication between the organizers and subscribed users.

### Project scope and feasibility

The project scope is well-defined with specific features that will leverage all the required technologies outlined in the course requirements. The features are carefully planned, supported by architecture designs, database schema and user interface diagrams created at the proposal stage to ensure feasibility of the project. The final product will be a working solution that is ready to be utilized by the community, demonstrating the team’s ability to deliver a high-quality, impactful application within the project timeline.

## Tentative Plan

The team plans to break down the project into smaller manageable tasks that can be worked on by the two members of the team in parallel, maintaining steady and incremental progress. We will adopt an agile development approach to identify any challenges early and ensure seamless integration of our individual contributions.

In week one, the team will begin by setting up the foundations of our project. One member will initialize the frontend, installing the necessary dependencies and creating the basic components of the web application. The other member will work on creating the server and database connection.

By the second week, we plan to have all the backend work completed and ready to be integrated with the frontend. One member will implement all the API endpoints to retrieve and update events and user data. The other member will be responsible for creating the user authentication and authorization flows, as well as integrating external APIs for our advanced features. The functionality of all endpoints will be verified locally using API testing tools like Postman.

We plan to then focus on frontend development in week three, with one member working on building the dashboard for viewing / searching volunteering events while the other member creates the event creation form and organization profile pages. We aim to minimize potential code conflicts or overlap by distributing the frontend work based on page routes. This work incorporates integrating with the backend API.

Finally, week four will consist mainly of testing and any final code refinements. Both members will be responsible for testing and writing proper documentation as we prepare for the final deliverables.

This structured and incremental approach should keep the team on track and progressing at a reasonable development speed. Based on the existing plan and scope, the team is confident that we will be able to achieve our goals and deliver a high-quality volunteering events platform within our project timeline.
