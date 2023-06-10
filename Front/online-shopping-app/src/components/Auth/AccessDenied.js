import Nav from "../UI/Nav";

const AccessDenied = () => {
  return (
    <>
      <Nav></Nav>
      <div style={{ textAlign: "center" }}>
        <img
          src="/images/access-denied.png"
          style={{ width: 200, height: 200, marginTop: 130, marginBottom: 50 }}
        />
        <h2 style={{ color: "red" }}>Nemate pravo pristupa ovoj stranici.</h2>
      </div>
    </>
  );
};

export default AccessDenied;
