/**
 * 工具函数
 */
class Helper {

    constructor() {
    }

    /**
     * 去重
     * @param a
     * @returns {any[]}
     */
    duplicate(...a) {
        return Array.from(new Set(...a));
    }

    /**
     * 比较两个值是否相等
     * @param a
     * @param b
     * @returns {boolean}
     */
    isEquals(a, b) {
        return a === b;
    }
}