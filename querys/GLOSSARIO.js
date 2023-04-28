export const GLOSSARIO = `
  {
    homeBanners {
      title
    }
    
    toggleTexts {
      initials
      label
    }

    toggleLists (orderBy: publishedAt_DESC) {
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