# FakeSlam! - The fake news prediction bot

## 1. Overview

a. The problem

Fake news is a deliberate use of media services to mislead and decieve the reader. The piece of information is often so
well written and organised that a common person falls prey to the deception. The fake news maybe simply spread to
increase the revenue of a site by increasing traffic, to spread hoaxes and even to tarnish the reputation of an entity -
person or organisation.

b. The solution

The project aims to tackle the problem of fake news. FakeSlam is a simple chatbot designed for this purpose. The bot
works on the concensus i.e., agreement of various users over geniunity of the given news.

## 2. Working

a. General Working

The bot works on the ethereum blockchain platform. The bot lets various users to post different articles. Other users
can vote over the genuinity of the article i.e., whether the article is real or fake. At the end, the genunity of the
article is decided by the votes of the majority.

b. Process

1. The bot is hosted on Toshi platform. The users can access the bot from the Toshi platform.
2. The user can then post or review different articles.
3. The user can post any article for free. The posted article stays under review for 15 days wherein various users can
   vote over the article - over whether it is fake or genuine. (The user posts the URL to article.)
4. The geniunity is decided by the vote of majority.
5. When the user votes on an article, the user need to pay a certain amount. The chatbot can exchange ethers for
   different local cryptocurrencies. The user can of course pay more than the threshold but a minimum is necessary to
   discourage fake or unintentional votes.
6. The user can then submit a response about the article and then wait for the final review to come in.
7. When the final review comes in, the total amount submitted by the users is distributed among the winning group of
   users (based on their skill factor - see below) - the majority, after a small deduction as a commission to the
   developers. This rewarding procedure strengthens the user base. Especially the users knowledgeable about the field.
   The users are alloted levels , based on the number of correct predictions that they make, the frequency of use of the
   service and the amount they invest. These factors together constitute the skills of a user on the platform.

c. Skill Factor

On the basis of skills, users are divided into four levels : Level 1, Level 2, Level 3 and Level 4 users. A vote of a
user is equivalent to the numerical value of his/her level in points. So a vote of Level 4 user is equivalent to 4
points. The article is judged on the basis of the points in the favour of it being real or fake. If a user is correct,
he/she is rewarded on the basis of his/her level. The skill factor increases the contribution of the experienced and
skilled users, thereby increasing the efficiency of the chatbot.

## 3. Advantages of using the blockchain platform

a. Since the data is completely decentralised over its user base, it cannot be manipulated by taknig control of the
resources of the chatbot service.

b. The blockchain platform provides smart contract services which eliminate the need of complete trust between the
parties. The trust is otherwise set up by a third party

## Instructions to Run

1. Clone this repo
2. Run `docker-compose build` once
3. `docker-compose up` to run the server
4. Visit the Toshi Dev Client for Android, and search for `fakeslambot` in the Favorites Tab.
