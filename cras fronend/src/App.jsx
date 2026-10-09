import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8090";

async function apiRequest(path, options = {}, token = "") {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data;
}

// Supports a direct list or common Spring Boot response wrappers.
function extractResources(data) {
  if (Array.isArray(data)) return data;

  const candidates = [
    data?.resources,
    data?.data,
    data?.content,
    data?.items,
    data?.data?.resources,
    data?.data?.content,
  ];

  return candidates.find(Array.isArray) || [];
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("crasSession")) || null;
    } catch {
      return null;
    }
  });

  const [authPage, setAuthPage] = useState("login");

  function handleLogin(data) {
    const nextSession = {
      token: data.token,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("crasSession", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function logout() {
    localStorage.removeItem("crasSession");
    setSession(null);
    setAuthPage("login");
  }

  if (!session) {
    return (
      <AuthPage
        page={authPage}
        setPage={setAuthPage}
        onAuthenticated={handleLogin}
      />
    );
  }

  if (session.role === "COMMUNITY_USER") {
    return <CommunityDashboard session={session} onLogout={logout} />;
  }

  if (session.role === "RESOURCE_MANAGER") {
    return <ManagerDashboard session={session} onLogout={logout} />;
  }

  return (
    <main className="center-screen">
      <div className="card">
        <h2>Unrecognized account role</h2>
        <p>Your account does not have a supported CRAS role.</p>
        <button onClick={logout}>Log out</button>
      </div>
    </main>
  );
}

function AuthPage({ page, setPage, onAuthenticated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    role: "COMMUNITY_USER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSignup = page === "signup";

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const path = isSignup
        ? "/api/auth/signup"
        : "/api/auth/login";

      const payload = isSignup
        ? {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            location: form.location.trim(),
            role: form.role,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data?.token || !data?.role) {
        throw new Error(
          "The backend did not return a token and role."
        );
      }

      onAuthenticated(data);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-brand">
        <div className="brand-mark">C</div>
        <p className="eyebrow">COMMUNITY EMERGENCY SUPPORT</p>
        <h1>CRAS</h1>
        <h2>Community Resource Allocation System</h2>

        <p className="brand-description">
          Helping communities request essential resources and helping
          resource managers maintain emergency supplies.
        </p>

        <div className="brand-points">
          <span>✓ Emergency resource requests</span>
          <span>✓ Inventory management</span>
          <span>✓ Automatic severity calculation</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">
            {isSignup ? "GET STARTED" : "WELCOME BACK"}
          </p>

          <h2>
            {isSignup ? "Create your account" : "Sign in to CRAS"}
          </h2>

          <p className="muted">
            {isSignup
              ? "Register to access your CRAS workspace."
              : "Enter your account details to continue."}
          </p>

          <form onSubmit={submit} className="form-stack">
            {isSignup && (
              <>
                <label>
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Enter your name"
                    required
                    autoComplete="name"
                  />
                </label>

                <label>
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="City or community"
                    autoComplete="address-level2"
                  />
                </label>

                <label>
                  Account type
                  <select
                    name="role"
                    value={form.role}
                    onChange={updateField}
                  >
                    <option value="COMMUNITY_USER">
                      Community User
                    </option>
                    <option value="RESOURCE_MANAGER">
                      Resource Manager
                    </option>
                  </select>
                </label>
              </>
            )}

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
              />
            </label>

            {error && <div className="alert error">{error}</div>}

            <button className="primary-button" disabled={loading}>
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup
              ? "Already have an account?"
              : "New to CRAS?"}{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setError("");
                setPage(isSignup ? "login" : "signup");
              }}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="auth-footnote">
            Your dashboard is selected according to the role returned
            by the backend.
          </p>
        </div>
      </section>
    </main>
  );
}

function AppHeader({ session, subtitle, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-inline">
        <div className="brand-mark small">C</div>
        <div>
          <strong>CRAS</strong>
          <span>Community Resource Allocation System</span>
        </div>
      </div>

      <div className="account-area">
        <div className="account-info">
          <strong>{session.name}</strong>
          <span>{subtitle}</span>
        </div>
        <button className="secondary-button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

function CommunityDashboard({ session, onLogout }) {
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const [form, setForm] = useState({
    resourceId: "",
    quantity: "",
    affectedPeople: "",
    peopleInDanger: "",
    criticalPeople: "",
    hoursWithoutResource: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function loadResources() {
    setLoadingResources(true);
    setError("");

    try {
      const data = await apiRequest(
        "/api/resources",
        {},
        session.token
      );

      setResources(extractResources(data));
    } catch (err) {
      setError(`Could not load resources: ${err.message}`);
    } finally {
      setLoadingResources(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitRequest(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!form.resourceId) {
      setError("Please select a resource.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(
        "/api/requests",
        {
          method: "POST",
          body: JSON.stringify({
            requesterName: session.name,
            resourceId: Number(form.resourceId),
            quantity: Number(form.quantity),
            affectedPeople: Number(form.affectedPeople),
            peopleInDanger: Number(form.peopleInDanger),
            criticalPeople: Number(form.criticalPeople),
            hoursWithoutResource: Number(form.hoursWithoutResource),
          }),
        },
        session.token
      );

      setResult(data);

      setForm({
        resourceId: "",
        quantity: "",
        affectedPeople: "",
        peopleInDanger: "",
        criticalPeople: "",
        hoursWithoutResource: "",
      });
    } catch (err) {
      setError(err.message || "Could not submit your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <AppHeader
        session={session}
        subtitle="Community User"
        onLogout={onLogout}
      />

      <main className="dashboard">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">COMMUNITY WORKSPACE</p>
            <h1>Emergency resource request</h1>
            <p className="muted">
              Tell us what your community needs. CRAS calculates severity
              automatically from the information you provide.
            </p>
          </div>
          <div className="role-pill community-pill">
            Community User
          </div>
        </div>

        <div className="content-grid">
          <section className="card form-card">
            <div className="section-heading">
              <div>
                <h2>Request details</h2>
                <p className="muted">
                  Enter accurate emergency information.
                </p>
              </div>
              <span className="step-number">01</span>
            </div>

            <form onSubmit={submitRequest} className="form-stack">
              <label>
                Resource required
                <select
                  name="resourceId"
                  value={form.resourceId}
                  onChange={updateField}
                  required
                  disabled={loadingResources}
                >
                  <option value="">
                    {loadingResources
                      ? "Loading resources..."
                      : "Select resource"}
                  </option>

                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name} — {resource.availableQuantity}{" "}
                      {resource.unit} available
                    </option>
                  ))}
                </select>

                {!loadingResources && resources.length === 0 && (
                  <small>
                    No resources are available to select yet.
                  </small>
                )}

                <button
                  type="button"
                  className="text-button"
                  onClick={loadResources}
                  disabled={loadingResources}
                >
                  {loadingResources ? "Loading..." : "Refresh resources"}
                </button>
              </label>

              <label>
                Quantity required
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={updateField}
                  placeholder="e.g. 100"
                  required
                />
              </label>

              <div className="field-grid">
                <label>
                  Affected people
                  <input
                    type="number"
                    name="affectedPeople"
                    min="0"
                    value={form.affectedPeople}
                    onChange={updateField}
                    placeholder="e.g. 120"
                    required
                  />
                </label>

                <label>
                  People in danger
                  <input
                    type="number"
                    name="peopleInDanger"
                    min="0"
                    value={form.peopleInDanger}
                    onChange={updateField}
                    placeholder="e.g. 30"
                    required
                  />
                </label>

                <label>
                  Critical people
                  <input
                    type="number"
                    name="criticalPeople"
                    min="0"
                    value={form.criticalPeople}
                    onChange={updateField}
                    placeholder="e.g. 8"
                    required
                  />
                </label>

                <label>
                  Hours without resource
                  <input
                    type="number"
                    name="hoursWithoutResource"
                    min="0"
                    value={form.hoursWithoutResource}
                    onChange={updateField}
                    placeholder="e.g. 6"
                    required
                  />
                </label>
              </div>

              <div className="info-note">
                <strong>Automatic severity calculation</strong>
                <p>
                  You don't need to enter a severity score. The backend
                  calculates it when the request is submitted.
                </p>
              </div>

              {error && <div className="alert error">{error}</div>}

              <button
                className="primary-button"
                disabled={
                  loading ||
                  loadingResources ||
                  resources.length === 0
                }
              >
                {loading
                  ? "Submitting request..."
                  : "Submit emergency request"}
              </button>
            </form>
          </section>

          <aside className="side-column">
            <section className="card side-card">
              <div className="side-icon blue">!</div>
              <h3>How it works</h3>
              <ol className="process-list">
                <li>Submit your emergency details.</li>
                <li>CRAS calculates and stores severity.</li>
                <li>Your request is saved with its status.</li>
              </ol>
            </section>

            {result && (
              <section className="card result-card">
                <div className="success-mark">✓</div>
                <p className="eyebrow">REQUEST SUBMITTED</p>
                <h2>Request created</h2>

                <div className="result-row">
                  <span>Request ID</span>
                  <strong>{result.id ?? "Saved"}</strong>
                </div>

                <div className="result-row">
                  <span>Severity</span>
                  <strong>
                    {result.severity ?? "Calculated by backend"}
                  </strong>
                </div>

                <div className="result-row">
                  <span>Status</span>
                  <strong>{result.status ?? "PENDING"}</strong>
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function ManagerDashboard({ session, onLogout }) {
  const [resources, setResources] = useState([]);

  const [form, setForm] = useState({
    name: "",
    unit: "packet",
    availableQuantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadResources() {
    setError("");

    try {
      const data = await apiRequest(
        "/api/resources",
        {},
        session.token
      );

      setResources(extractResources(data));
    } catch (err) {
      setError(`Could not load inventory: ${err.message}`);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function addResource(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const saved = await apiRequest(
        "/api/resources",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name.trim(),
            unit: form.unit,
            availableQuantity: Number(form.availableQuantity),
          }),
        },
        session.token
      );

      setNotice(
        `${saved.name} inventory saved. Current quantity: ${saved.availableQuantity} ${saved.unit}.`
      );

      setForm({
        name: "",
        unit: "packet",
        availableQuantity: "",
      });

      await loadResources();
    } catch (err) {
      setError(err.message || "Could not save resource.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <AppHeader
        session={session}
        subtitle="Resource Manager"
        onLogout={onLogout}
      />

      <main className="dashboard">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">RESOURCE MANAGEMENT</p>
            <h1>Inventory dashboard</h1>
            <p className="muted">
              Add new resource types or replenish stock for existing
              resources.
            </p>
          </div>

          <div className="role-pill manager-pill">
            Resource Manager
          </div>
        </div>

        <div className="manager-grid">
          <section className="card form-card">
            <div className="section-heading">
              <div>
                <h2>Add or replenish stock</h2>
                <p className="muted">
                  Existing resource names increase the current quantity.
                </p>
              </div>
              <span className="step-number">01</span>
            </div>

            <form onSubmit={addResource} className="form-stack">
              <label>
                Resource name
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="e.g. Food"
                  required
                />
              </label>

              <label>
                Unit
                <select
                  name="unit"
                  value={form.unit}
                  onChange={updateField}
                >
                  <option value="litre">Litre</option>
                  <option value="packet">Packet</option>
                  <option value="kit">Kit</option>
                  <option value="bottle">Bottle</option>
                  <option value="bed">Bed</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="person">Person</option>
                </select>
              </label>

              <label>
                Quantity to add
                <input
                  type="number"
                  name="availableQuantity"
                  min="0"
                  step="1"
                  value={form.availableQuantity}
                  onChange={updateField}
                  placeholder="e.g. 500"
                  required
                />
              </label>

              <div className="info-note purple-note">
                <strong>Inventory rule</strong>
                <p>
                  If the resource already exists with the same unit, this
                  quantity is added to its existing stock.
                </p>
              </div>

              {error && <div className="alert error">{error}</div>}
              {notice && <div className="alert success">{notice}</div>}

              <button className="primary-button" disabled={loading}>
                {loading ? "Saving inventory..." : "Save resource"}
              </button>
            </form>
          </section>

          <section className="card inventory-card">
            <div className="section-heading">
              <div>
                <h2>Available inventory</h2>
                <p className="muted">Current resource quantities.</p>
              </div>

              <button
                className="secondary-button"
                type="button"
                onClick={loadResources}
              >
                Refresh
              </button>
            </div>

            {resources.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">□</div>
                <strong>No resources found</strong>
                <p>Add your first resource using the form.</p>
              </div>
            ) : (
              <div className="inventory-list">
                {resources.map((resource) => (
                  <div className="inventory-item" key={resource.id}>
                    <div className="resource-symbol">
                      {resource.name?.charAt(0)?.toUpperCase() || "R"}
                    </div>

                    <div className="resource-details">
                      <strong>{resource.name}</strong>
                      <span>Resource ID: {resource.id}</span>
                    </div>

                    <div className="resource-quantity">
                      <strong>{resource.availableQuantity}</strong>
                      <span>{resource.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;