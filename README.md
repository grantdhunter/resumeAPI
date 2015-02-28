# resumeAPI
API for my resume, get it in json format or in pretty format.

This project was inspired by https://jsonresume.org/. 
I though since I have my resume in json format already why not turn it into an api that people can query against.

## API Reference
###Authentication
The resumeAPI is secured with Basic Auth. A user needs a username and password to beable to access it. This is because resumes usually have some personal information such as adresses and phone numbers that should not be left out in the open for all the bots to see.

###JSON
The json portion of the API can be found at **/resume**.
The root will return the full json resume. If an attribute is added to the end of the path **/resume/basics** only the basic information will be returned.

These are all teh available attribute:
-basics
-work
-volunteer
education
-awards
-publications
-skills
-languages
-interests
-projects
-references

##Pretty
Another portion of the API is a easy to ready HMTL formatted version of the resume. The pretty resume has all the same information as the json just in a more human friendly presentation. The pretty resume can be accessed at **/resume/pretty**.
