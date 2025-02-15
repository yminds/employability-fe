import React from 'react'

type Props = {}

const usePreSignedUrl = (props: Props) => {
    const [preSignedUrl, setPreSignedUrl] = React.useState<string | null>(null);
   

    

  return{
    preSignedUrl,
  }
}

export default usePreSignedUrl