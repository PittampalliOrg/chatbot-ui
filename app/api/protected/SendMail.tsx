const RestAPIComponent: React.FC = () => {
  const [apiResult, setApiResult] = useState<string | null>(null)
  const { instance } = useMsal()
  console.log(instance as PublicClientApplication)

  const invokeRestApiClick = async () => {
    try {
      const data = await invokeRestAPI(
        instance as PublicClientApplication,
        "http://localhost:3000/api/protected"
      )
      console.log(data)
      setApiResult(data.result)
    } catch (error) {
      setApiResult("Error!")
      console.error("Error fetching data from the API: ", error)
    }
  }

  return (
    <div>
      <button onClick={invokeRestApiClick}>Invoke REST API</button>
      {apiResult && <p>Here is the Secured API result: {apiResult}</p>}
    </div>
  )
}

export default RestAPIComponent
