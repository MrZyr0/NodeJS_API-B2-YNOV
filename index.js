'user strict'

const readline = require('readline')
const readlineSync = require('readline-sync')
const request = require('request')
const URLusers = 'http://jsonplaceholder.typicode.com/users'
const URLposts = 'http://jsonplaceholder.typicode.com/posts'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function getRandomInt(max)
{
    let rnd = Math.floor(Math.random() * Math.floor(max))

    if (rnd == 0) { getRandomInt(max) }
    return rnd
}

function runWithCallback()
{
    let userName; let users; let user; let posts; let userPosts; let post; let comments


    rl.question('Username (Leanne Graham) : ', function(answer) {

        userName = answer

        console.log('\n\t' + 'Hi ' + userName + '!' + '\n')
        console.log('\t' + 'Here is a comment from one of your messages :')

        request.get(URLusers, function (error, response, body) {
            // console.log('error:', error); // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

            users = JSON.parse(body)

            user = users.find(function(element){ return element.name == userName })
            if (!user)
            {
                console.log('Username invalid')
                rl.close()
                return
            }

            request.get(URLposts, function (error, response, body) {

                posts = JSON.parse(body)
                userPosts = posts.filter(function (element) { return element.userId == user.id })

                const randomPostId = getRandomInt(userPosts.length - 1)

                request(`${URLposts}/${randomPostId}/comments`, (error, response, body) => {
                    comments = JSON.parse(body);

                    const commentsOfPost = comments.filter(function (element) {
                        return element.postId == randomPostId;
                    })

                    const randomCommentId = getRandomInt(commentsOfPost.length - 1)


                    const comment = commentsOfPost[randomCommentId].body

                    console.log('\n' + '"' + comment + '"');
                    rl.close()
                })
            })
        })
    })
}


runWithCallback()
