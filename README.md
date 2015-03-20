#resumeAPI
API for my resume, get it in json format or in pretty format.

This project was inspired by https://jsonresume.org/. 
I though since I have my resume in json format already why not turn it into an api that people can query against.

##Installation
```
git clone https://github.com/grantdhunter/resumeAPI
```
```
npm install
```
create a `resume.json` with the schema described at https://jsonresume.org/schema. Then add a `profile.jpg` to the `public` folder.

Run:

```
node app.js
```


##API Reference
###Authentication
The resumeAPI is secured with Basic Auth. A user needs a username and password to beable to access it. This is because resumes usually have some personal information such as adresses and phone numbers that should not be left out in the open for all the bots to see.

###JSON
The json portion of the API can be found at **/resume/:resumeName**.
The root will return the full json resume. If an attribute is added to the end of the path **/resume/:resumeName/basics** only the basic information will be returned.

These are all the available attribute:
- basics
- work
- volunteer
- education
- awards
- publications
- skills
- languages
- interests
- projects
- references

###Pretty
Another portion of the API is a easy to ready HMTL formatted version of the resume. The pretty resume has all the same information as the json just in a more human friendly presentation. The pretty resume can be accessed at **/resume/:resumeName/pretty**.


##Exmaples
###Curl

    curl -u username:password http://yourdomain.tld/resume/:resumeName

####Result:

```json
{
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "picture": "",
    "email": "john@gmail.com",
    "phone": "(912) 555-4321",
    "website": "http://johndoe.com",
    "summary": "A summary of John Doe...",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "http://twitter.com/john"
    }]
  },
  "work": [{
    "company": "Company",
    "position": "President",
    "website": "http://company.com",
    "startDate": "2013-01-01",
    "endDate": "2014-01-01",
    "summary": "Description...",
    "highlights": [
      "Started the company"
    ]
  }],
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "website": "http://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description...",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "education": [{
    "institution": "University",
    "area": "Software Development",
    "studyType": "Bachelor",
    "startDate": "2011-01-01",
    "endDate": "2013-01-01",
    "gpa": "4.0",
    "courses": [
      "DB1101 - Basic SQL"
    ]
  }],
  "awards": [{
    "title": "Award",
    "date": "2014-11-01",
    "awarder": "Company",
    "summary": "There is no spoon."
  }],
  "publications": [{
    "name": "Publication",
    "publisher": "Company",
    "releaseDate": "2014-10-01",
    "website": "http://publication.com",
    "summary": "Description..."
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "Javascript"
    ]
  }],
  "languages": [{
    "language": "English",
    "fluency": "Native speaker"
  }],
  "interests": [{
    "name": "Wildlife",
    "keywords": [
      "Ferrets",
      "Unicorns"
    ]
  }],
  "references": [{
    "name": "Jane Doe",
    "reference": "Reference..."
  }]
}
```
