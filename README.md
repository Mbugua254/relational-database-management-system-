statement :=
  create_table |
  insert |
  select |
  update |
  delete

create_table :=
  CREATE TABLE identifier ( column_def [, column_def ] );

column_def :=
  identifier type [PRIMARY KEY] [UNIQUE]

type := INT | TEXT

insert :=
  INSERT INTO identifier VALUES ( literal [, literal ] );

select :=
  SELECT select_list FROM identifier [ join ] [ where ];

join :=
  INNER JOIN identifier ON identifier = identifier

where :=
  WHERE identifier = literal

update :=
  UPDATE identifier SET identifier = literal WHERE identifier = literal;

delete :=
  DELETE FROM identifier WHERE identifier = literal;
