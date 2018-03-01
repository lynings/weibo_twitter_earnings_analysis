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
}