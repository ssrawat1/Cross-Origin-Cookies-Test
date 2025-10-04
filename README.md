# Cross-Domain Cookies — Local Testbed (Live Server)

**Purpose**  
Experiment with how browsers **set** and **send** cookies across domains using `SameSite` (None, Lax, Strict), with HTTPS support for production-like testing.

---

## TL;DR
- **SameSite=None + Secure** → required for cookies across different domains (HTTPS).  
- **SameSite=Lax** → sent on same-site requests and **top-level navigations** (user-initiated POST/PUT/DELETE); not sent for programmatic fetch/XHR from another origin.  
- **SameSite=Strict** → only sent for same-site requests.  
> Chrome has a short (~2 min) user-interaction exception for Lax cookies on top-level POST navigations — do not rely on it in production.

---

## Quick Setup

 ```text
http://127.0.0.1:5500/CSRF/index.html   Frontend
http://localhost:4000/                  Backend
