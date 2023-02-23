export const LAYOUT = `
{
  menus(orderBy: ordem_ASC) {
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
logoSms {
  logo {
    url
  }
}
footers{
  label
  url
}
logoImpulsos {
  logo {
    url
  }
}
socialMedias {
  logo {
    url
  }
  url
}
copyrights {
  contato
  copyright
}
logoMenuMoblies {
  logo {
    url
  }
}
}
`
