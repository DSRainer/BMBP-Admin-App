import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packages, Package } from '../data/packages';
import { activities } from '../data/activities';
import { themes } from '../data/themes';
import { addons } from '../data/addons';

const Column: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }>=({ title, action, children })=>{
  return (
    <div className="card h-100">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <div className="fw-semibold">{title}</div>
        {action}
      </div>
      <div className="card-body d-flex flex-column gap-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

const Pill: React.FC<{ selected?: boolean; onClick?: () => void; children: React.ReactNode }>=({ selected, onClick, children })=>{
  return (
    <button
      type="button"
      className={`btn btn-sm text-start w-100 ${selected ? 'btn-primary' : 'btn-outline-secondary'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const PackageEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pkg: Package | undefined = useMemo(
    () => packages.find(p => String(p.id) === String(id)),
    [id]
  );

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [showActivities, setShowActivities] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showAddons, setShowAddons] = useState(false);

  useEffect(() => {
    if (pkg) {
      setName(pkg.name);
      setPrice(pkg.price);
      setDescription(pkg.description);
      setSelectedActivities(pkg.activities.map(a=>a.id));
      setSelectedThemes(pkg.themes.map(t=>t.id));
      setSelectedAddons(pkg.addons.map(a=>a.id));
    }
  }, [pkg]);

  const toggleActivity = (id: number) => {
    setSelectedActivities(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };
  const toggleTheme = (id: number) => {
    setSelectedThemes(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };
  const toggleAddon = (id: number) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  if (!pkg) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/packages">Packages</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Not found</li>
            </ol>
          </nav>
        </div>
        <div className="alert alert-warning">Package not found.</div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><button className="btn btn-link p-0" onClick={() => navigate(-1)}>Back</button></li>
            <li className="breadcrumb-item"><Link to="/packages">Packages</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Edit: {pkg.name}</li>
          </ol>
        </nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/packages')}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              console.log({ name, price, description, selectedActivities, selectedThemes, selectedAddons });
              navigate('/packages');
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Column title="Package Details">
            <div className="mb-2">
              <label className="form-label small text-muted">Name</label>
              <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label small text-muted">Price</label>
              <input type="number" className="form-control" value={price} onChange={(e)=>setPrice(Number(e.target.value))} />
            </div>
            <div className="mb-2">
              <label className="form-label small text-muted">Description</label>
              <textarea className="form-control" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
          </Column>
        </div>

        <div className="col-12 col-lg-4">
          <Column
            title="Activities"
            action={
              <button className="btn btn-sm btn-outline-primary" onClick={()=>setShowActivities(prev=>!prev)}>
                {showActivities ? 'Done' : 'Add Activity'}
              </button>
            }
          >
            {!showActivities && (
              <div className="d-flex flex-column gap-2">
                {activities.filter(a=>selectedActivities.includes(a.id)).length === 0 && (
                  <div className="text-muted small">No activities selected</div>
                )}
                {activities.filter(a=>selectedActivities.includes(a.id)).map(a => (
                  <Pill key={a.id} selected>
                    {a.name}
                  </Pill>
                ))}
              </div>
            )}
            {showActivities && (
              <div className="d-flex flex-column gap-2">
                {activities.map(a => (
                  <Pill
                    key={a.id}
                    selected={selectedActivities.includes(a.id)}
                    onClick={()=>toggleActivity(a.id)}
                  >
                    {a.name}
                  </Pill>
                ))}
              </div>
            )}
          </Column>
        </div>

        <div className="col-12 col-lg-4">
          <Column
            title="Themes"
            action={
              <button className="btn btn-sm btn-outline-primary" onClick={()=>setShowThemes(prev=>!prev)}>
                {showThemes ? 'Done' : 'Add Theme'}
              </button>
            }
          >
            {!showThemes && (
              <div className="d-flex flex-column gap-2">
                {themes.filter(t=>selectedThemes.includes(t.id)).length === 0 && (
                  <div className="text-muted small">No themes selected</div>
                )}
                {themes.filter(t=>selectedThemes.includes(t.id)).map(t => (
                  <Pill key={t.id} selected>
                    <span className="me-2 align-middle" style={{ display: 'inline-block', width: 12, height: 12, background: t.color, borderRadius: 2 }} />
                    {t.name}
                  </Pill>
                ))}
              </div>
            )}
            {showThemes && (
              <div className="d-flex flex-column gap-2">
                {themes.map(t => (
                  <Pill
                    key={t.id}
                    selected={selectedThemes.includes(t.id)}
                    onClick={()=>toggleTheme(t.id)}
                  >
                    <span className="me-2 align-middle" style={{ display: 'inline-block', width: 12, height: 12, background: t.color, borderRadius: 2 }} />
                    {t.name}
                  </Pill>
                ))}
              </div>
            )}
          </Column>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-lg-6">
          <Column
            title="Add-ons"
            action={
              <button className="btn btn-sm btn-outline-primary" onClick={()=>setShowAddons(prev=>!prev)}>
                {showAddons ? 'Done' : 'Add Add-on'}
              </button>
            }
          >
            {!showAddons && (
              <div className="d-flex flex-column gap-2">
                {addons.filter(a=>selectedAddons.includes(a.id)).length === 0 && (
                  <div className="text-muted small">No add-ons selected</div>
                )}
                {addons.filter(a=>selectedAddons.includes(a.id)).map(ad => (
                  <Pill key={ad.id} selected>
                    {ad.name} (${ad.price})
                  </Pill>
                ))}
              </div>
            )}
            {showAddons && (
              <div className="d-flex flex-column gap-2">
                {addons.map(ad => (
                  <Pill
                    key={ad.id}
                    selected={selectedAddons.includes(ad.id)}
                    onClick={()=>toggleAddon(ad.id)}
                  >
                    {ad.name} (${ad.price})
                  </Pill>
                ))}
              </div>
            )}
          </Column>
        </div>
        <div className="col-12 col-lg-6">
          <Column title="Summary">
            <div className="text-muted small">Selected items reflect the current package. Interactivity and persistence can be wired to your backend or state later.</div>
            <div className="mt-2">
              <div><strong>Activities:</strong> {activities.filter(a=>selectedActivities.includes(a.id)).map(a => a.name).join(', ') || 'None'}</div>
              <div><strong>Themes:</strong> {themes.filter(t=>selectedThemes.includes(t.id)).map(t => t.name).join(', ') || 'None'}</div>
              <div><strong>Add-ons:</strong> {addons.filter(a=>selectedAddons.includes(a.id)).map(a => a.name).join(', ') || 'None'}</div>
            </div>
          </Column>
        </div>
      </div>
    </div>
  );
};

export default PackageEditor;


