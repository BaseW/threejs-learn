import Model from './3dmodel';

export async function load() {
    const m = new Model();
    await m.create();
    return m;
}
