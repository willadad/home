/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates an icon component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.name - The iconify name of the icon.
 * @returns {import('mdast').Parent} The created icon component.
 */
export function IconComponent(properties) {
    const name = properties.name;
    if (!name) {
        return h("span", { class: "hidden" }, "Invalid icon name");
    }

    const iconUrl = `https://api.iconify.design/${name.replace(":", "/")}.svg`;

    return h("span", {
        class: "md-icon",
        style: `mask-image: url(${iconUrl}); -webkit-mask-image: url(${iconUrl});`,
    });
}
