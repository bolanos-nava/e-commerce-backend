# Cookies and sessions

Cookies are used to save state between requests. The idea is to have a mechanism with which the server can receive data from the client on every request. 

A cookie is a small text file saved on the client that contains some data, like information of the logged user so the server can identify him. To instruct the client to save a cookie, the server must respond with the header "Set-Cookie". Then, on every subsequest request, the user agent appends the cookies on the header.

Session: a "session" is data stored on the server side to be used on every request. To use sessions, the client should have a cookie with an id that identifies it. When the server receives it, can look for the appropriate session data in memory, in the database or in some other data store that you choose. This "sid" cookie is also stored in the client through the "Set-Cookie" header.