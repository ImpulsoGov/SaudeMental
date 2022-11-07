export const LAYOUT = `
{
  municipios {
    nome
    uf
  }

  logos {
    logo {
      url
    }
  }

  menus {
    label
    url
    sub {
      ... on SubMenu {
        label
        url
        item {
          ... on SubMenuItem {
            label
            url
          }
        }

      }
    }
  }


  buttonImages {
    image {
      url
    }
  }

  contactCopyrights {
    email
    copyright
  }

  socialMedias {
    url
    logo {
      url
    }
  }
}
`