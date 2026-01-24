

```ts
-- =============================================  
-- 1. 创建触发器函数 (Function)-- =============================================  
CREATE OR REPLACE FUNCTION auto_offline_product_if_no_sku()  
RETURNS TRIGGER AS $$  
DECLARE  
    remaining_count INTEGER;  
BEGIN  
    -- 查询该 product_id 下是否还有其他 SKU    SELECT COUNT(*) INTO remaining_count  
    FROM sku  
    WHERE product_id = OLD.product_id;  
  
    -- 调试信息 (在 DataGrip 的 Output 窗口可以看到)  
    RAISE NOTICE 'Product ID: %, Remaining SKUs: %', OLD.product_id, remaining_count;  
  
    -- 如果数量为 0，下架商品  
    IF remaining_count = 0 THEN  
        UPDATE product  
        SET status = 0  
        WHERE id = OLD.product_id;  
    END IF;  
  
    RETURN OLD;  
END;  
$$ LANGUAGE plpgsql;  
  
-- =============================================  
-- 2. 创建触发器 (Trigger) 并绑定到表  
-- =============================================  
-- 先尝试删除旧的（防止重复报错）  
DROP TRIGGER IF EXISTS trg_check_sku_count_after_delete ON sku;  
  
CREATE TRIGGER trg_check_sku_count_after_delete  
AFTER DELETE ON sku  
FOR EACH ROW  
EXECUTE FUNCTION auto_offline_product_if_no_sku();
```




```sql
-- 1. 创建触发器函数  
CREATE OR REPLACE FUNCTION sync_product_status_to_site()  
RETURNS TRIGGER AS $$  
BEGIN  
    -- 如果商品状态变为 0 (下架/禁用)  
    IF NEW.status = 0 THEN  
        -- 将该商品在所有站点中设为不可见  
        UPDATE site_product  
        SET is_visible = false  
        WHERE product_id = NEW.id;  
    END IF;  
    RETURN NEW;  
END;  
$$ LANGUAGE plpgsql;  
  
-- 2. 创建触发器  
CREATE TRIGGER trg_auto_hide_site_product  
AFTER UPDATE ON product  
FOR EACH ROW  
-- 只有当状态发生改变，且新状态为 0 时才触发（性能优化）  
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 0)  
EXECUTE FUNCTION sync_product_status_to_site();
```