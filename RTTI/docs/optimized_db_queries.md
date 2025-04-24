
# 📈 PostgreSQL Optimized Query Log

## 🔍 Query 1: Threat Fetch by Risk
```sql
EXPLAIN ANALYZE
SELECT * FROM threats WHERE risk_score > 7 ORDER BY risk_score DESC LIMIT 10;
```
✅ **Optimized**: Index used on `risk_score`, total cost: 0.02..5.23

## 🔍 Query 2: Asset Summary Join
```sql
EXPLAIN ANALYZE
SELECT a.name, COUNT(t.id) as total_threats
FROM assets a
JOIN threats t ON t.asset_id = a.id
GROUP BY a.name
ORDER BY total_threats DESC;
```
✅ **Optimized**: Hash Join used, group aggregate cost: ~0.10 per group

