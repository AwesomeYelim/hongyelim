import { NextResponse } from "next/server";
import mysql from "mysql";

export async function GET(req: Request, res: Response) {
  let queryString = "SELECT 1 + 1";

  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    ssl: "TLS_AES_256_GCM_SHA384",
    // password: "02031122",
  });
  console.log("들어옴?");

  connection.connect((err) => {
    if (err) console.log(err);
    console.log("connected !");
  });
  // function queryPromise(queryString: string) {
  //   return new Promise((resolve, reject) => {
  //     connection.query(queryString, (error: any, results: unknown) => {
  //       if (error) {
  //         console.log(error);

  //         return reject(error);
  //       }
  //       resolve(results);
  //     });
  //   });
  // }

  // try {
  //   const rows = await queryPromise(queryString);
  //   NextResponse.json(rows);
  //   console.log(rows);
  // } catch (error) {
  //   console.error(error);
  //   NextResponse.error();
  // }
}
