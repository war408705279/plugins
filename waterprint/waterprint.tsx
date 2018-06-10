/**
 * 正则匹配表达式
 */
export const regulaer = {
    blankReg: /\s+/g,
    intReg: /^[1-9]\d*$/,
}

/**
 * 水印参数
 * username: 水印内容
 * angle: 角度
 * font: 字体
 */
export type wpParas = {
    username: string,
    angle?: number | string,
    font?: string,
}

/**
 * 对外开放的生成水印入口函数（返回style对象）
 * @param paras 参数信息 
 * username: 必选
 * angle: 可选，默认为15
 * font: 可选，默认为24px -apple-system, sans-serif, Arial
 */
export function waterPrint(paras: object = {
    angle: 15,
    font: "24px -apple-system, sans-serif, Arial"
}): object {
    return this.createWaterPrint(paras);
}

/**
 * 检查参数
 * @param paras 传入的参数
 */
function checkParas(paras: object): boolean {
    if (!paras) {
        console.warn("缺少参数");
        return false;
    }
    // 校验username
    const username = paras["username"];
    if (!username) {
        console.warn("参数中缺少username");
        return false;
    }
    if (typeof username !== "string") {
        console.warn("username必须为string形式");
        return false;
    }
    if (!username.replace(regulaer.blankReg, "")) {
        console.warn("username不能为空字符串");
        return false;
    }
    // 校验angle
    const angle = paras["angle"].toString();
    if (!regulaer.intReg.test(angle)) {
        console.warn("angle必须为整数");
        return false;
    }
    // 校验font
    const font = paras["font"];
    if (typeof font !== "string") {
        console.warn("font必须为string形式");
        return false;
    }
    return true;
}

/**
 * 生成水印（返回style对象）
 * @param paras 传入的参数
 */
function createWaterPrint(paras: object): object {
    const isPass = this.checkParas(paras);
    if (isPass) {
        // 水印内容
        const text = paras["username"];
        // 角度
        const angle = parseInt(paras["angle"].toString());
        // 宽度
        const width = text.length * 20;
        // 高度
        const height = Math.sin(angle) * width;
        // 创建canvas
        const canvas: any = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.font = paras["font"];
        ctx.textBaseline = "alphabetic";
        ctx.rotate(-angle * Math.PI / 180);
        ctx.fillStyle = "#ddd";
        ctx.fillText(text, -10, height / 2);
        const dataURL = canvas.toDataURL();
        const style = {
            backgroundImage: `url(${dataURL})`,
            backgroundSize: `${width / 2}px`,
            backgroundColor: "#f5f7fb",
        };
        return style;
    } else {
        return {};
    }
}