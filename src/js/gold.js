function processPaymentReceivedPage (args) {
  let redirectTo = getCookie(COOKIES.GOLD_BUY_REDIRECT_URL) || '/'
  let redirectLabel = getCookie(COOKIES.GOLD_BUY_REDIRECT_LABEL) || 'Home'
  templatePageProcessor('payment-received-page', args, {
    transform: () => {
      return {
        redirectTo: redirectTo,
        redirectLabel: redirectLabel
      }
    },
    completed: () => {
      setTimeout(() => {
        go(redirectTo)
      }, 5000)
    }
  })
}

function processSubscriptionsPage (args) {
  const scope = {
    loading: true
  }

  if (!isSignedIn()) {
    go('/signin')
    return
  }

  scope.xsollaIframeSrc = ''
  scope.hasSubscriptions = hasSubscriptions()
  renderContent('subscriptions-page', scope)

  const tokenType = 'subscriptions'

  generateXsollaIframeSrc(tokenType, {}, (err, src) => {
    if (err) {
      renderError(err)
      return
    }
    scope.loading = false
    scope.xsollaIframeSrc = src
    renderContent('subscriptions-page', scope)
    setXsollaIframesLoading()
  })
}

function processGoldBuyPage (args) {
  const scope = {
    loading: true
  }

  if (!isSignedIn()) {
    go('/sign-up?redirectTo=' + encodeURIComponent('/gold/buy') + '&continueTo=Buy%20Gold')
    return
  }

  scope.xsollaIframeSrc = ''
  scope.isSignedIn = isSignedIn()
  scope.hasGold = hasGoldAccess()

  renderContent('gold-buy-page', scope)

  const redirectTo = getCookie(COOKIES.GOLD_BUY_REDIRECT_URL)
  console.log('redirectTo', redirectTo);
  const opts =  {}

  if (redirectTo) {
    opts.return_url = window.location.origin + redirectTo
  }

  generateXsollaIframeSrc('gold', opts, (err, src) => {
    if (err) {
      renderError(err)
      return
    }
    scope.loading = false
    scope.xsollaIframeSrc = src
    renderContent('gold-buy-page', scope)
    setXsollaIframesLoading()
  })
}

function generateXsollaIframeSrc (type, opts, done) {
  generateXsollaToken(type, opts, (err, token) => {
    if (err) {
      return done(err)
    }

    done(null, `${XSOLLA_PAYSTATION_URL}?access_token=${token}`)
  })
}

/**
 * Generates an xsolla token from the server that is used to render certain iframes
 * for xsolla pages
 *
 * @param {String} type The type of token. eg: 'gold', 'subscriptions'
 * @param {transactionCallback} done
 */
function generateXsollaToken (type, opts, done) {
  let data = {
    return_url: window.location.protocol + '//' + window.location.host + '/payment-received',
    device: isXsollaMobileBrowser() ? 'mobile' : 'desktop'
  }

  data = Object.assign(data, opts)

  request({
    method: 'POST',
    withCredentials: true,
    data: data,
    url: endpoint + '/xsolla/token/' + type
  }, (err, result) => {
    if (err) {
      done(err)
      return
    }

    done(null, result.token)
  })
}

function processGoldPage (args) {
  processor(args, {
    start: function (args) {
      const scope = {}
      let featureBlocks = []

      featureBlocks.push({
        id: 'download-access',
        title: 'Download Access',
        description: 'Download tracks in MP3, FLAC, and WAV format.',
        image: '/img/gold-landing/1-DownloadAccess-v2.jpg',
        cta: 'Download Music',
        download: true
      }, {
        id: 'early-streaming',
        title: 'Early Streaming Access',
        description: 'Listen to releases on Monstercat.com 20 hours before they are released to everyone else.',
        cta: 'Listen Early',
        image: '/img/gold-landing/2-StreamingAccess.jpg',
      }, {
        id: 'support-the-artists',
        title: 'Support the Artists',
        description: 'Artists are paid out from Gold subscriptions based on how much people listen to their songs.',
        cta: 'Support the Artists',
        image: '/img/gold-landing/3-SupportArtists.jpg',
      }, {
        id: 'shop-discounts',
        title: 'Discounts in the Shop',
        description: 'Every month you have Gold you get a discount code for 10% off in <a href="https://shop.monstercat.com">the shop</a>. Goes up to 15% off after a year and 20% off after two years.',
        cta: 'Get Discounts',
        image: 'https://assets.monstercat.com/monstercat.com/merch40.jpg?image_width=1024'
      }, {
        id: 'discord',
        title: 'Gold-only Discord Chat',
        description: 'Come chat with us and other superfans in our Discord server.',
        cta: 'Join the Chat',
        image: '/img/gold-landing/5-Discord.jpg',
        discord: true
      }, {
        id: 'reddit',
        title: 'Subreddit Flair on /r/Monstercat',
        description: 'Show your bling off in the Monstercat subreddit.',
        cta: 'Get Your Flair',
        image: '/img/gold-landing/6-Reddit.png',
        reddit: true
      })

      featureBlocks = featureBlocks.map((i, index) => {
        i.isOdd = !(index % 2 == 0)
        return i
      })
      scope.featureBlocks = featureBlocks
      scope.hasGoldAccess = hasGoldAccess()
      scope.sessionName = getSessionName()
      scope.getGoldUrl = getGetGoldLink()

      if(scope.hasGoldAccess) {
        scope.redditUsername = session.user.redditUsername
      }
      else {
        scope.redditUsername = false
      }

      renderContent(args.template, scope)
    }
  })
}
