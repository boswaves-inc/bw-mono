// import * as html from "./html";
// import * as lead from "./lead";
// import * as button from "./button";
// import * as heading from "./heading";
// import * as markdown from "./markdown";
// import * as subheading from "./sub-heading";
// import { z } from "zod/v4";

// const elements = {
//     // html,
//     // lead,
//     button,
//     heading,
//     // subheading,
//     // markdown,
// }

// const primitive = z.union([
//     z.string(),
//     z.number()
// ])

// // const element_type = z.discriminatedUnion<any, 'type'>('type', Object.entries(elements).map(([key, { schema }]) => {
// //     return schema.extend({
// //         type: z.literal(key),
// //         content: z.lazy(() => content_type).optional()
// //     })
// // }))

// // const content_type = z.lazy(() =>
// //     z.union([element_type, primitive_type, z.array(content_type)])
// // )



// export default {
//     html,
//     lead,
//     button,
//     heading,
//     subheading,
//     markdown,
// }