function GLBLoadError({ error }) {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "24%",
      }}
    >
      <h4>Oops! Something went wrong!</h4>
      <p>Maybe because of: ${error}</p>
      <p>Please, click LEAVE, then try to rejoin the room.</p>
    </section>
  );
}

export default GLBLoadError;
