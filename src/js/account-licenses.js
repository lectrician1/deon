function processAccountLicensesPage (args) {
  if (!isSignedIn()) {
    return go('/signin?redirect=' + encodeURIComponent(window.location.pathname + window.location.search) + '&continueTo=Licenses')
  }

  pageProcessor(args, {
    transform: function (args) {
      return {
        licenses: args.result.results,
        hasGoldAccess: hasGoldAccess(),
        isSignedIn: isSignedIn()
      }
    },
    completed: function () {
      const qs = searchStringToObject()
      if (qs.vendor) {
        findNode('[name=vendor]').value = qs.vendor
      }
      if (qs.identity) {
        findNode('[name=identity]').value = qs.identity
      }
    }
  })
}

function submitAddLicense (e) {
  console.log('e', e)
  submitForm(e, {
    url: endpoint + '/self/whitelist',
    method: 'POST',
    withCredentials: true
  })
}
