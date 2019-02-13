import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
    await knex.schema.createTable("foobar", table =>{
        table.increments("id");
    })
};

exports.down = async function (knex: Knex): Promise<any> {
    await knex.schema.dropTable("foobar")
};
