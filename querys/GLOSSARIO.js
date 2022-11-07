export const GLOSSARIO = `
  {
    homeBanners {
      title
    }
    
    toggleTexts {
      initials
      label
    }

    toggleLists {
      title
      blocks {
        ... on Block {
          description
          source
          subTitle
          concept {
            ... on Concept {
              title
              elements
              
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
  }
`