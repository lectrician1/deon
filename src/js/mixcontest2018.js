console.log("hi")

const currentPollID = '5b3fa9d9fe37f5d18dea1dd3'

let mixPoll = {}
const mixedContestScope = {}

function processMixContest2018Page (args) {
  renderContent('mixcontest2018', mixedContestScope)
  requestJSON({
    url: endpoint + '/poll/' + currentPollID + '/breakdown'
  }, (err, result) => {
    if (err) {
      alert("error!")
      return
    }
    const status = result.status

    mixPoll = result.poll
    mixedContestScope.loading = false
    mixedContestScope.poll = mixPoll
    mixedContestScope.loggedIn = isSignedIn()
    mixedContestScope.hasVoted = status.voted
    mixedContestScope.backgroundImg = '/img/mixcontest.jpg'
    mixedContestScope.art = 'https://assets.monstercat.com/releases/covers/cotw-205.jpg?image_width=512'
    mixedContestScope.titleName = 'Mix Contest 2018'
    mixedContestScope.artists = 'Artist'
    mixedContestScope.track = ''

    // if counting down to start date
    mixedContestScope.showStartDate = (!status.ended && !status.open) ? true : false

    // if voting is open
    mixedContestScope.votingOpen = (status.open == true) ? true : false

    // if user has voted
    status.canVote = true // to show the poll even if account has already voted
    mixedContestScope.hasVoted = (status.canVote == true) ? false : true

    renderContent('mixcontest2018', mixedContestScope)
    startCountdownTicks()
  })

}

function submitMixContestVotes2018(e) {
  //prevents refresh
  e.preventDefault()
  const form = e.target
  const data = formToObject(form)

  console.log('data', data)

  const choiceIndexes = []

  data.choices.forEach((checked, index) => {
    console.log(index + ' ' + checked)
    if (checked) {
      choiceIndexes.push(index)
    }
  })

  if (choiceIndexes.length > 2){
    toasty(Error('Too many!'))
    return
  }
  if (choiceIndexes.length < 1){
    toasty(Error('Too Few!'))
    return
  }

  request({
    url: endpoint + '/vote',
    method: 'POST',
    withCredentials: true,
    data: {
      pollId: currentPollID,
      choices: choiceIndexes
    }
  }, (err, result) => {
    if (err) {
      toasty(err)
      return
    }

    toasty("Success, your vote has been submitted.")

    mixedContestScope.hasVoted = true
    renderContent('mixcontest2018', mixedContestScope)
  })
}

function checkboxLimit(){
  const checkBoxGroup = document.getElementById('checkbox')
  const limit = 2

}
