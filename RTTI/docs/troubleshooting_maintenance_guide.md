
# 🧰 Troubleshooting & Maintenance Guide

**System:** Cybersecurity Threat Intelligence Platform  
**Last Updated:** 2025-04-24

---

## 🔧 Regular Maintenance Tasks

| Task                          | Frequency      | Instructions |
|-------------------------------|----------------|--------------|
| ✅ Check DB indexes           | Weekly         | Run `REINDEX` or `EXPLAIN ANALYZE` on slow queries |
| ✅ Backup PostgreSQL DB       | Daily (auto)   | Use `pg_dump` or automated cron jobs |
| ✅ Rotate API logs            | Weekly         | Archive or rotate logs using `logrotate` or `pm2` |
| ✅ Monitor OSINT ingestion    | Daily          | Check logs for failures or rate-limit errors |
| ✅ Security patch updates     | Monthly        | `apt update && apt upgrade` or vendor patch checks |
| ✅ GPT API key usage          | Weekly         | Check OpenAI dashboard or logs for 429 errors |
| ✅ Verify report generation   | Weekly         | Test /api/reports/download endpoint |

---

## 🛠️ Troubleshooting Checklist

### 1. Server/API Issues
- ✅ Restart API server (`pm2 restart all` or `npm run dev`)
- ✅ Check logs (`pm2 logs`, `journalctl -u yourservice`)
- ❌ 500 errors: Validate input data and server logs
- ❌ CORS errors: Ensure headers (`Access-Control-Allow-Origin`) are set

### 2. Database Problems
- ❌ `relation does not exist`: Re-run schema: `psql -f schema.sql`
- ❌ Permission denied: Use `GRANT ALL ON ... TO ...`
- ❌ Foreign key errors: Ensure parent asset/threat exists before linking

### 3. OSINT Ingestion Errors
- ❌ API key error: Check `.env` and API dashboard
- ❌ Rate limited: Implement delays/retries in fetch script
- ❌ Data missing: Log response and validate input format

### 4. Performance Issues
- ✅ Use `htop` or `top` to check resource usage
- ✅ Run Locust or JMeter to simulate load
- ❌ GPT slowdowns: Batch calls and reduce frequency
- ❌ Report delay: Optimize data loading and PDF streaming

---

## 📦 Backup & Restore

```bash
# Backup DB
pg_dump -U admin -F c threat_intel > backup_$(date +%F).sql

# Restore DB
pg_restore -U admin -d threat_intel backup_YYYY-MM-DD.sql
```

---

## 🔐 Security Checklist

- [ ] Validate all API inputs
- [ ] Rotate secrets and keys regularly
- [ ] Monitor rate limiting and suspicious requests
- [ ] Review access logs monthly

---

## 🧼 Log Cleanup

```bash
# Rotate logs manually
mv api.log api_$(date +%F).log
touch api.log
```

Set up `cron` or `logrotate` for automation.

---

## 📞 Support Contacts

| Component    | Maintainer       | Contact            |
|--------------|------------------|---------------------|
| API Server   | DevOps Team      | devops@yourorg.com  |
| Database     | DBA Team         | dbadmin@yourorg.com |
| Security     | SecOps           | security@yourorg.com |

---

_Make sure this document is reviewed after every major system update._
