function processAccountLicensesPage (args) {
  if (!isSignedIn()) {
    return go('/signin?redirect=' + encodeURIComponent(window.location.pathname + window.location.search) + '&continueTo=Licenses')
  }

  pageProcessor(args, {
    transform: function (args) {
      return {
        licenses: args.result.results,
        hasGoldAccess: true,
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

      const addLicenseBtn = findNode('#license-add-btn')

      const addLicenseForm = findNode('.license-form')

      function toggleAddLicense() {
        addLicenseForm.classList.toggle("license-form-display")
      }
      addLicenseBtn.addEventListener("click", toggleAddLicense)

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

//addLicenseBtn.addEventListener("click", toggleAddLicense)
