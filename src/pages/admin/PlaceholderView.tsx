
const PlaceholderView = ({ title }: { title: string }) => (
  <div>
    <div className="mb-4">
      <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>{title}</h1>
      <p className="text-muted">Sección administrativa en construcción.</p>
    </div>
    <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <i className="fa-solid fa-person-digging" style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
      <h2 className="title-md">Próximamente</h2>
      <p className="text-muted">Esta vista está preparada en el enrutador para la siguiente fase de desarrollo.</p>
    </div>
  </div>
);

export default PlaceholderView;
