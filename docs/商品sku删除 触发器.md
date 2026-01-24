

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