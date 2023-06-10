import Nav from "../UI/Nav";

const AccessDenied = () => {
    return (
        <>
            <div style={{ textAlign: 'center', margin: 100 }}> 
            <img src="/images/access-denied.png" style={{ width: 200, height: 200 }}/>
            <h2 style={{ color: 'red' }} >Nemate pravo pristupa ovoj stranici.</h2>
            </div>
            
        </>);
}

export default AccessDenied;